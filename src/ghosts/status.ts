export enum Status {
    Unselected = 0,
    Selected = 1,
    Crossed = 2,
}

export function next_status(status: Status): Status {
    switch (status) {
        case Status.Unselected:
            return Status.Selected
        case Status.Selected:
            return Status.Crossed
        case Status.Crossed:
            return Status.Unselected
    }
}