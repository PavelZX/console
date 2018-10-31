defmodule Console.Events.EventResolver do
  import Ecto.Query, warn: false

  alias Console.Repo
  alias Console.Events.Event

  def paginate(%{context_id: context_id, page: page, page_size: page_size, context_name: context_name}, %{context: %{current_team: current_team}}) do
    resource = Ecto.assoc(current_team, String.to_atom(context_name)) |> Repo.get!(context_id)

    events =
      Ecto.assoc(resource, :events)
      |> order_by([desc: :reported_at])
      |> Repo.paginate(page: page, page_size: page_size)
    {:ok, events}
  end

  def recent(%{context_id: context_id, context_name: context_name}, %{context: %{current_team: current_team}}) do
    resource = Ecto.assoc(current_team, String.to_atom(context_name)) |> Repo.get!(context_id)
    cutoff_time = NaiveDateTime.add(NaiveDateTime.utc_now(), -300, :second)

    events =
      Ecto.assoc(resource, :events)
      |> where([e], e.inserted_at > ^cutoff_time)
      |> order_by([desc: :reported_at])
      |> Repo.all()
    {:ok, events}
  end

  def demo(%{team_id: team_id}, %{context: %{current_team: current_team}}) do
    cutoff_time = NaiveDateTime.add(NaiveDateTime.utc_now(), -300, :second)

    events = Repo.all(
      from e in Event,
      select: e,
      where: e.inserted_at > ^cutoff_time,
      where: e.team_id == ^current_team.id,
      order_by: [desc: :reported_at]
    )
    {:ok, events}
  end
end
