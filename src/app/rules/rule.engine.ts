import { Injectable } from '@angular/core';
import { EngineRecipe, JasperEngine } from '@kuremichi/jasper';
import { Observable } from 'rxjs';
import { RuleProvider } from './rule.store';

@Injectable()
export class RuleEngine {
  private engine: JasperEngine;
  constructor(
    // private toastr: ToastrService
    ruleProvider: RuleProvider,
  ) {
    this.engine = new JasperEngine({
      ruleStore: ruleProvider.getRuleStore(),
      options: {
        recipe: EngineRecipe.BusinessProcessEngine,
        suppressDuplicateTasks: false,
      },
      logger: console,
    });
  }

  execute(object: any, ruleName: string): Observable<any> {
    return this.engine.run({ root: object, ruleName });
  }
}
