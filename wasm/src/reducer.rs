use std::rc::Rc;
use web_sys::File;
use yew::Reducible;

pub enum FileAction {
    Set(File),
    Unset,
}

pub struct FileState {
    pub file: Option<File>,
}

impl Default for FileState {
    fn default() -> Self {
        Self { file: None }
    }
}

impl Reducible for FileState {
    type Action = FileAction;

    fn reduce(self: Rc<Self>, action: Self::Action) -> Rc<Self> {
        let new_state = match action {
            FileAction::Set(file) => FileState { file: Some(file) },
            FileAction::Unset => FileState { file: None },
        };

        new_state.into()
    }
}
