# SRE GitOps Kubernetes Lab

Laboratório prático de GitOps utilizando **Kubernetes**, **Argo CD**, **Minikube** e uma aplicação **Node.js containerizada**.

O objetivo deste projeto é demonstrar um fluxo moderno de entrega contínua baseado em GitOps, onde o repositório Git é a fonte da verdade e o Argo CD sincroniza automaticamente o estado desejado da aplicação com o cluster Kubernetes.

---

## Tecnologias utilizadas

- Node.js
- Express.js
- Docker
- Kubernetes
- Minikube
- Argo CD
- GitOps
- kubectl

---

## Objetivo do projeto

Este projeto simula um ambiente real de deploy em Kubernetes utilizando Argo CD.

O fluxo principal é:

```text
Desenvolvedor altera código ou manifesto
  ↓
Realiza commit e push no GitHub
  ↓
Argo CD monitora o repositório
  ↓
Argo CD identifica diferenças entre Git e cluster
  ↓
Argo CD sincroniza os manifests
  ↓
Kubernetes atualiza a aplicação
  ↓
Aplicação fica disponível no Minikube