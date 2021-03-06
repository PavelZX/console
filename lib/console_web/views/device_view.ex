defmodule ConsoleWeb.DeviceView do
  use ConsoleWeb, :view
  alias ConsoleWeb.DeviceView
  alias ConsoleWeb.EventView
  alias ConsoleWeb.GroupView

  def render("index.json", %{devices: devices}) do
    render_many(devices, DeviceView, "device.json")
  end

  def render("show.json", %{device: device}) do
    render_one(device, DeviceView, "device.json")
  end

  def render("device.json", %{device: device}) do
    %{
      id: device.id,
      name: device.name,
      mac: device.mac,
      team_id: device.team_id
    }
    |> append_events(device.events)
    |> GroupView.append_group_names(device.groups)
  end

  defp append_events(json, events) do
    if Ecto.assoc_loaded?(events) do
      events_json = render_many(events, EventView, "event.json")
      Map.put(json, :events, events_json)
    else
      json
    end
  end
end
