defmodule ConsoleWeb.Router.GatewayController do
  use ConsoleWeb, :controller

  alias Console.Gateways
  alias Console.Gateways.Gateway
  alias Console.HardwareIdentifiers.HardwareIdentifier
  alias Console.HardwareIdentifiers

  action_fallback ConsoleWeb.FallbackController

  def register(conn, %{"OUI" => oui, "nonce" => nonce, "gateway" => %{"id" => token, "public_key" => public_key, "payee_address" => payee_address}}) do
    with gateway = %Gateway{} <- HardwareIdentifiers.get_resource_by_hardware_identifier(token, Gateway), # need to verify OUI and nonce
      nil <- gateway.public_key,
      {:ok, updatedGateway} <- Gateways.update_gateway(gateway, %{public_key: public_key}) do
        broadcast(updatedGateway)

        render(conn, "gateway_register.json", %{tx: "some transaction", signature: "some signature"}) # need to generate tx and sig
    else _ ->
      {:error, :not_found}
    end
  end

  def verify(conn, %{"OUI" => oui, "gateway" => %{"id" => token}}) do
    with gateway = %Gateway{} <- HardwareIdentifiers.get_resource_by_hardware_identifier(token, Gateway), # need to verify OUI
      "pending" <- gateway.status,
      {:ok, updatedGateway} <- Gateways.update_gateway(gateway, %{status: "verified"}) do
        broadcast(updatedGateway)

        conn
        |> send_resp(:no_content, "")
    else _ ->
      {:error, :not_found}
    end
  end

  defp broadcast(%Gateway{} = gateway) do
    gateway = Gateways.fetch_assoc(gateway, [:team])

    Absinthe.Subscription.publish(ConsoleWeb.Endpoint, gateway, gateway_updated: "#{gateway.team.id}/gateway_updated/#{gateway.id}")
  end
end
