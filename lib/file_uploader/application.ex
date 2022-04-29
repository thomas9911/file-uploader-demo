defmodule FileUploader.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      {Plug.Cowboy, scheme: :http, plug: FileUploader, options: [port: 4040]},
      {Plug.Cowboy.Drainer, refs: [FileUploader.HTTP]}
    ]

    opts = [strategy: :one_for_one, name: FileUploader.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
