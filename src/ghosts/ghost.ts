import {EvidenceType} from './evidence'
import {Status} from "./status";

export class Ghost {
    name: String
    evidences: Array<EvidenceType>
    status: Status
    
    constructor(name: String, evidences: Array<EvidenceType>, status: Status = Status.Unselected) {
        this.name = name
        this.evidences = evidences
        this.status = status
    }
}