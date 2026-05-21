# Node.js + Kubernetes + Argo CD

Projeto de laboratorio para demonstrar um fluxo simples de entrega com **Docker**, **Kubernetes**, **Minikube** e **Argo CD** usando uma aplicacao **Node.js com Express**.

A ideia principal e manter o Git como fonte da verdade: o codigo da aplicacao e os manifests Kubernetes ficam neste repositorio, enquanto o Argo CD acompanha as mudancas e sincroniza o cluster automaticamente.

## Visao geral do fluxo

```text
1. Desenvolvedor altera o codigo ou os manifests
             |
             v
2. Alteracoes sao enviadas para o GitHub
             |
             v
3. Argo CD monitora o repositorio Git
             |
             v
4. Argo CD compara Git x estado atual do cluster
             |
             v
5. Kubernetes aplica ou corrige os recursos
             |
             v
6. Aplicacao fica disponivel no cluster
```

## Estrutura do projeto

```text
.
+-- app/
|   +-- Dockerfile
|   +-- package.json
|   +-- src/
|       +-- server.js
+-- argocd/
|   +-- application.yaml
+-- k8s/
|   +-- configmap.yaml
|   +-- deployment.yaml
|   +-- namespace.yaml
|   +-- service.yaml
+-- README.md
```

## O que cada parte faz

| Caminho | Funcao |
| --- | --- |
| `app/` | Contem a aplicacao Node.js e o `Dockerfile` usado para gerar a imagem. |
| `k8s/namespace.yaml` | Cria o namespace `rfthz-app`. |
| `k8s/configmap.yaml` | Define variaveis de ambiente usadas pela aplicacao. |
| `k8s/deployment.yaml` | Cria os pods da aplicacao, configura imagem, replicas, probes e recursos. |
| `k8s/service.yaml` | Expoe a aplicacao via `NodePort` na porta `30080`. |
| `argocd/application.yaml` | Define a aplicacao no Argo CD e aponta para os manifests em `k8s/`. |

## Aplicacao

A aplicacao Express expoe duas rotas:

| Rota | Descricao |
| --- | --- |
| `/` | Retorna uma mensagem da aplicacao e o ambiente configurado. |
| `/health` | Endpoint usado pelas probes do Kubernetes para verificar saude. |

## Como executar localmente

Entre na pasta da aplicacao:

```bash
cd app
```

Instale as dependencias:

```bash
npm install
```

Inicie a aplicacao:

```bash
npm start
```

Depois acesse:

```text
http://localhost:3000
```

## Como gerar a imagem Docker

Na raiz do projeto, execute:

```bash
docker build -t rfthz-app-argocd:1.0.0 ./app
```

Se estiver usando Minikube, carregue a imagem no cluster:

```bash
minikube image load rfthz-app-argocd:1.0.0
```

## Deploy manual no Kubernetes

Com o cluster ativo, aplique os manifests:

```bash
kubectl apply -f k8s/
```

Verifique os recursos criados:

```bash
kubectl get all -n rfthz-app
```

Se estiver usando Minikube, acesse a aplicacao pelo service:

```bash
minikube service rfthz-app-service -n rfthz-app
```

Ou acesse diretamente pelo NodePort, caso o IP do Minikube esteja disponivel:

```text
http://<minikube-ip>:30080
```

## Deploy com Argo CD

O arquivo `argocd/application.yaml` registra a aplicacao no Argo CD.

Antes de aplicar, ajuste o campo `repoURL` para apontar para o repositorio correto:

```yaml
source:
  repoURL: https://github.com/SEU-USUARIO/meu-app-argocd-k8s.git
  targetRevision: main
  path: k8s
```

Depois aplique a configuracao:

```bash
kubectl apply -f argocd/application.yaml
```

O Argo CD passara a acompanhar a pasta `k8s/`. Quando houver mudancas no Git, ele compara o estado desejado com o estado atual do cluster e sincroniza automaticamente.

## Fluxo GitOps esperado

```text
Codigo ou manifesto alterado
        |
        v
Commit e push para o GitHub
        |
        v
Argo CD detecta a mudanca
        |
        v
Argo CD aplica os manifests da pasta k8s/
        |
        v
Kubernetes atualiza Deployment, Service e ConfigMap
        |
        v
Aplicacao atualizada no cluster
```

## Validacoes uteis

Ver pods:

```bash
kubectl get pods -n rfthz-app
```

Ver logs:

```bash
kubectl logs -n rfthz-app -l app=rfthz-app
```

Ver service:

```bash
kubectl get svc -n rfthz-app
```

Testar health check:

```bash
curl http://<host-da-aplicacao>/health
```

## Resumo

Este projeto mostra um fluxo GitOps simples:

- A aplicacao e empacotada em uma imagem Docker.
- O Kubernetes executa a aplicacao usando manifests declarativos.
- O Argo CD monitora o repositorio Git.
- Qualquer alteracao versionada pode ser sincronizada automaticamente no cluster.

Esse modelo ajuda a manter rastreabilidade, padronizacao e previsibilidade no deploy de aplicacoes em Kubernetes.
