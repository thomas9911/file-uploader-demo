import Config

config :cors_plug,
  origin: [
    "http://localhost:1234",
    "http://localhost:8080",
    "http://127.0.0.1:8080"
  ],
  max_age: 86400,
  methods: ["GET", "POST"]

config :presigned_url,
  ex_aws: %{
    access_key_id: "test",
    secret_access_key: "secret123",
    s3_auth_version: "4",
    host: "localhost",
    port: "9000",
    region: "us-east-1",
    scheme: "http://"
  }

config :logger, level: :debug

# config :ex_aws, :hackney_opts,
#   recv_timeout: :infinity
