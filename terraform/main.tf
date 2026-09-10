# main.tf
# Exemplo simples de Terraform: gera um arquivo local com informações
# do projeto. Não precisa de conta na nuvem, então pode ser demonstrado
# ao vivo com "terraform init" e "terraform apply".

terraform {
  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }
}

variable "nome_projeto" {
  default = "conversor-temperatura"
}

resource "local_file" "info_projeto" {
  filename = "${path.module}/info-projeto.txt"
  content  = "Projeto: ${var.nome_projeto}\nCriado com Terraform.\n"
}

output "arquivo_criado" {
  value = local_file.info_projeto.filename
}
