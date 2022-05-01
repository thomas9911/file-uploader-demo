use gloo::net::http;
use serde::Deserialize;
use yew::prelude::*;
use yew_hooks::{use_async_with_options, UseAsyncOptions};

#[derive(Debug, Clone, Deserialize)]
pub struct ApiResult {
    url: String,
    fields: std::collections::HashMap<String, String>,
}

fn jsvalue_to_string(value: wasm_bindgen::JsValue) -> String {
    value.as_string().unwrap_or(String::new())
}

async fn do_upload_flow(file: web_sys::File) -> Result<(), String> {
    let file_name = file.name();
    let content_type = file.type_();

    let resp = http::Request::get(&format!(
        "http://localhost:4040/api/{}/{}",
        file_name, content_type
    ))
    .send()
    .await;

    let api_result = resp
        .map_err(|e| e.to_string())?
        .json::<ApiResult>()
        .await
        .map_err(|e| e.to_string())?;

    let form_data = http::FormData::new().map_err(jsvalue_to_string)?;

    let url = &api_result.url;
    for (key, value) in api_result.fields {
        form_data
            .append_with_str(&key, &value)
            .map_err(jsvalue_to_string)?;
    }
    form_data
        .append_with_blob("file", &file.slice().map_err(jsvalue_to_string)?)
        .map_err(jsvalue_to_string)?;

    let resp = http::Request::post(url)
        .body(form_data)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if resp.status() == 204 {
        Ok(())
    } else {
        Err(format!("{:?}", resp))
    }
}

#[derive(PartialEq, Properties, Clone)]
pub struct FileUploaderFields {
    pub file: web_sys::File,
}

#[function_component(FileUploader)]
pub fn file_uploader(props: &FileUploaderFields) -> Html {
    let request = use_async_with_options(
        do_upload_flow(props.file.clone()),
        UseAsyncOptions::enable_auto(),
    );

    html! {
        <div class="column block is-7">
            {
                if request.loading {
                    html! { "Loading" }
                } else {
                    html! {}
                }
            }
            {
                if let Some(_) = &request.data {
                    html! {"uploaded"}
                } else {
                    html! {}
                }
            }
            {
                if let Some(error) = &request.error {
                    html! { format!("error: {}", error) }
                } else {
                    html! {}
                }
            }
        </div>
    }
}
