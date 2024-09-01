# Project Setup and Configuration before starting the projects

## Overview

This project uses Docker to orchestrate multiple microservices, and Kafka components. To ensure these services can
communicate effectively and securely, we use Docker networks. This document explains why creating a custom Docker
network is necessary for this project.

## Why Create a Custom Docker Network?

In our project, we use a custom Docker network named `kfk-net` to facilitate communication between various services.

## How to Create the Network

To set up the required Docker network for this project, run the following command:

```shell
docker network create kfk-net
```
