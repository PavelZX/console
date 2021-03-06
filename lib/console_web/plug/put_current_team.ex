defmodule ConsoleWeb.Plug.PutCurrentTeam do
  alias Console.Teams

  import Plug.Conn, only: [assign: 3, send_resp: 3]

  def init(default), do: default

  def call(conn, _default) do
    case ConsoleWeb.Guardian.Plug.current_claims(conn) do
      %{"team" => team_id} ->
        current_user = conn.assigns.current_user

        if current_team = Teams.get_team(current_user, team_id) do
          current_membership = Teams.get_membership!(current_user, current_team)

          conn
          |> assign(:current_team, current_team)
          |> assign(:current_membership, current_membership)
        else
          conn
          |> send_resp(
            :forbidden,
            Poison.encode!(%{
              type: "forbidden_team",
              errors: ["You don't have access to this team"]
            })
          )
        end

      _ ->
        conn
    end
  end
end
