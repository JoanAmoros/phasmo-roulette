import {Status} from "./status"

export enum EvidenceType {
    Dots = "D.O.T.S.",
    Writing = "Ghost Writing",
    EMF5 = "EMF 5",
    Orbs = "Ghost Orbs",
    UV = "Fingerprints",
    Freezing = "Freezing Temperatures",
    SpiritBox = "Spirit Box",
}

export class Evidence {
    type: EvidenceType
    status: Status
    
    constructor(type: EvidenceType, status: Status) {
        this.type = type
        this.status = status
    }
}