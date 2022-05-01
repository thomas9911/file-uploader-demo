defmodule FileUploader do
  @moduledoc """
  Documentation for `FileUploader`.
  """
  use Plug.Router
  import Plug.Conn

  @bucket "testing"

  plug(CORSPlug)
  plug(Plug.Static, at: "/", from: "web/dist", only_matching: ["index", "src", "web"])
  plug(Plug.Static, at: "/wasm", from: "wasm/dist", only_matching: ["index"])
  # plug Plug.Static, at: "/", from: {:file_uploader, "priv/static"}

  plug(:match)
  plug(:dispatch)

  get "/api/:name/*content_type" do
    content_type = Enum.join(content_type, "/")

    config =
      PresignedUrl.Config.from_user(%{
        name: name,
        content_type: content_type,
        bucket: @bucket,
        max_file_size: 15 * 1024 ** 2
      })

    {:ok, response} = PresignedUrl.PostRequest.V4.sign_with_options(config)

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Jason.encode!(response))
  end

  get "/" do
    conn
    |> put_resp_content_type("text/html")
    |> send_resp(301, "<meta http-equiv=\"refresh\" content=\"0; URL=/index.html\" />")
  end

  get "/wasm" do
    conn
    |> put_resp_content_type("text/html")
    |> send_resp(301, "<meta http-equiv=\"refresh\" content=\"0; URL=/wasm/index.html\" />")
  end

  match _ do
    IO.inspect(conn)
    send_resp(conn, 404, "page not found 404")
  end
end
