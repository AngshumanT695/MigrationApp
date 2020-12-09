import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';


@Injectable()
class GetUpgradeListService {
    constructor(private http: HttpClient) { }

    execute(params:any) {
        return this.http.post('/api/get-upgrade-list', params);
    }
}