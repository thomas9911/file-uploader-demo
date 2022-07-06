defmodule FileUploader.Utils do

    def move(from_bucket, to_bucket, file) do
        config = PresignedUrl.Config.global
        long_config = PresignedUrl.Config.from_user(%{http_opts: [recv_timeout: :infinity]})

        with {:ok, %{status_code: 200}} <- ExAws.S3.upload_part_copy(to_bucket, file, from_bucket, file) |> ExAws.request(long_config),
            IO.inspect("done copying"),
        {:ok, %{status_code: 204}} <- ExAws.S3.delete_object(from_bucket, file) |> ExAws.request(config) do
            :ok
        else
            {_, body} -> {:error, body}
            e -> raise e
        end
    end
end

# notice copy is not instant

# notice delete is instant


# plan 
# data-lib add task supervisor for move file task
# add move to presignedurl lib
# add delete to presignedurl lib
# add telemetry to presigned url request
# catch telemetry in bootstrapper

