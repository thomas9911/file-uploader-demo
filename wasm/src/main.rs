use yew::prelude::*;

use web_sys::{Event, HtmlInputElement};

pub mod components;
pub mod reducer;
use components::{FileInput, FileUploader};

fn on_file_change(reducer: yew::UseReducerHandle<reducer::FileState>) -> yew::Callback<Event> {
    Callback::from(move |e: Event| {
        let input: HtmlInputElement = e.target_unchecked_into();

        if let Some(files) = input.files() {
            if files.length() == 1 {
                reducer.dispatch(reducer::FileAction::Set(files.get(0).unwrap()))
            }
        }
    })
}

#[function_component(App)]
fn app() -> Html {
    let state = use_reducer(reducer::FileState::default);
    let change = on_file_change(state.clone());

    let component = if let Some(f) = &state.file {
        html! {<FileUploader file={f.clone()}/>}
    } else {
        html! {
            <div class="column block is-7">
                <FileInput onchange={change}/>
            </div>
        }
    };

    html! {
        <div class="container">
            <div class="content">
                <h1 class="title">{"Upload file"}</h1>
            </div>

            <div class="columns is-centered">
                <div class="column block is-7">
                  <p>{"Just some cool text wow"}</p>
                </div>
            </div>
            <div class="columns is-centered">
                {component}
            </div>
        </div>
    }
}

fn main() {
    yew::start_app::<App>();
}
