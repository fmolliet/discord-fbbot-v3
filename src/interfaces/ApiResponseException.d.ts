import { Violation } from "./Violation";

export interface ApiResponseException {
    title: string,
    status: number,
    violations: Violation[]
}