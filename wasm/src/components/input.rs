use yew::prelude::*;

const ACCEPT: &'static str = "image/*";

#[derive(PartialEq, Properties, Clone)]
pub struct FileInputProps {
    pub onchange: Callback<Event>,
}

#[function_component(FileInput)]
pub fn file_input(props: &FileInputProps) -> Html {
    html! {
        <input
            type="file"
            id="fileinput"
            name="fileinput"
            accept={ACCEPT}
            onchange={&props.onchange}
        />
    }
}
