defmodule FileUploader.MixProject do
  use Mix.Project

  def project do
    [
      app: :file_uploader,
      version: "0.1.0",
      elixir: "~> 1.13",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      aliases: aliases()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger],
      mod: {FileUploader.Application, []}
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:plug_cowboy, "~> 2.5"},
      {:cors_plug, "~> 3.0"},
      {:presigned_url, "~> 0.1", organization: "betty_blocks_bv"}
    ]
  end

  defp aliases do
    [
      build_web: &build_web/1,
      start: "cmd bash ./scripts/server.sh"
    ]
  end

  defp build_web(_) do
    Mix.Tasks.Cmd.run([
      "--cd",
      "web",
      "npm install && $(npm bin)/parcel build --experimental-scope-hoisting src/index.html"
    ])
  end
end
