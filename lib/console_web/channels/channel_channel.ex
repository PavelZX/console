defmodule ConsoleWeb.ChannelChannel do
  use Phoenix.Channel

  alias Console.Teams

  def join("channel:all", _message, socket) do
    # current_user = Guardian.Phoenix.Socket.current_resource(socket)
    {:ok, socket}
  end

  def join("channel:" <> team_id, _params, socket) do
    current_user = Guardian.Phoenix.Socket.current_resource(socket)
    team = Teams.get_team!(team_id)

    if Teams.user_has_access?(current_user, team) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end
end
