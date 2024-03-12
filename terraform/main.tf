provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "arg" {
  name     = "skalbarasystemv7"
  location = "australiasoutheast"
}

resource "azurerm_container_registry" "acr" {
  name                = "skalbarasystemcontainerregistryv7"
  resource_group_name = azurerm_resource_group.arg.name
  location            = azurerm_resource_group.arg.location
  sku                 = "Basic"
  admin_enabled       = false
}

resource "azurerm_storage_account" "asa" {
  name                     = "ireojfohsarjfpojasv7"
  resource_group_name      = azurerm_resource_group.arg.name
  location                 = azurerm_resource_group.arg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "asc" {
  name                  = "storagecontainerv7"
  storage_account_name  = azurerm_storage_account.asa.name
  container_access_type = "private"
}

resource "azurerm_kubernetes_cluster" "akc" {
  name                = "kubernetesclusterv7"
  location            = azurerm_resource_group.arg.location
  resource_group_name = azurerm_resource_group.arg.name
  dns_prefix          = "exampleaks"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_B2s"
  }

  identity {
    type = "SystemAssigned"
  }
}

resource "azurerm_role_assignment" "akc" {
  principal_id                     = azurerm_kubernetes_cluster.akc.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                            = azurerm_container_registry.acr.id  # Corrected line
  skip_service_principal_aad_check = true
}

