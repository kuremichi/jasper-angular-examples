import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { RuleEngine } from './rules/rule.engine';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'test';

  result$ = this.ruleEngine.execute(
    { name: 'Guest' },
    'create an account',
  ).pipe(
    tap(() => {
      this.toastr.success('Done');
    })
  );
  /**
   *
   */
  constructor(
    private ruleEngine: RuleEngine,
    private toastr: ToastrService,
  ) {}
}
