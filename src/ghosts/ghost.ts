import {EvidenceType} from './evidence'
import {Status} from "./status";

export class Ghost {
    name: String
    evidence: Array<EvidenceType>
    status: Status
    
    constructor(name: String, evidence: Array<EvidenceType>, status: Status) {
        this.name = name
        this.evidence = evidence
        this.status = status
    }
}