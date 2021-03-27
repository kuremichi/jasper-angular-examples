import { Injectable } from '@angular/core';
import { Direction, ExecutionContext, ExecutionOrder, IRuleStore, Rule, SimpleRuleStore } from '@kuremichi/jasper';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { tap, switchMap, delay } from 'rxjs/operators';

export interface User {
  name: string;
}

@Injectable()
export class RuleProvider {
  rules: Rule<any>[] = [
    {
      name: 'send email',
      description: 'send an email to the user',
      action: (context: ExecutionContext<any>) =>
        new Observable((subsriber) => {
          console.log(`[${context.contextId}] sending email for....`);
          this.toastr.info(`sending email....`);
          // email body
          console.log(context.root);
          this.toastr.info(context.root, undefined, { enableHtml: true });
          setTimeout(() => {
            console.log(`[${context.contextId}] email sent!`);
            this.toastr.success(`email sent`);
            subsriber.next();
            subsriber.complete();
          }, Math.random() * 3000 + 2000);
        }),
    },
    {
      name: 'create an account',
      description: 'the workflow to get an account created',
      metadata: {
        entity: 'account',
      },
      action: (context: ExecutionContext<any>) =>
        of({
          id: 1,
          name: context.root.name,
        }).pipe(
          tap((user: { id: number; name: string }) => {
            console.log(
              `[${context.contextId}] an account for user ${user.name} has been created`
            );
          })
        ),
      direction: Direction.InsideOut,
      dependencies: {
        name: 'finishing user registration',
        rules: [
          {
            name: 'welcome user',
            executionOrder: ExecutionOrder.Sequential,
            maxConcurrency: 2,
            path: (context: ExecutionContext<User>) => {
              return of(context.root).pipe(
                switchMap((userObject) => {
                  return of(
                    `
                                    <html>
                                        <body>
                                            <p>Hi ${userObject.name}! Welcome to Jasper Rule Engine!</p>
                                        </body>
                                    </html>
                                `,
                    `
                                    <html>
                                        <body>
                                            <p>Hi ${userObject.name} 2 time! Welcome to Jasper Rule Engine!</p>
                                        </body>
                                    </html>
                                `,
                    `
                                    <html>
                                        <body>
                                            <p>Hi ${userObject.name} 3 time! Welcome to Jasper Rule Engine!</p>
                                        </body>
                                    </html>
                                `,
                    `
                                    <html>
                                        <body>
                                            <p>Hi ${userObject.name} 4 time! Welcome to Jasper Rule Engine!</p>
                                        </body>
                                    </html>
                                `
                  );
                })
              );
            },
            beforeDependency: (context) =>
              of(context.contextId).pipe(
                tap((contextId) => {
                  console.log(`[${contextId}] before welcome user`);
                })
              ),
            // tslint:disable-next-line:variable-name
            beforeEach: (
              // tslint:disable-next-line:variable-name
              _userObject: any,
              index: number,
              context: ExecutionContext<any>
            ) =>
              of(context.contextId).pipe(
                tap((contextId) => {
                  console.log(
                    `[${contextId}] before sending ${index + 1} email`
                  );
                }),
                delay(2000),
              ),
            rule: 'send email',
            // tslint:disable-next-line:variable-name
            afterEach: (
              // tslint:disable-next-line:variable-name
              _userObject: any,
              index: number,
              context: ExecutionContext<any>
            ) =>
              of(context.contextId).pipe(
                tap((contextId) => {
                  console.log(
                    `[${contextId}] after sending ${index + 1} email`
                  );
                })
              ),
            afterDependency: (context) =>
              of(context.contextId).pipe(
                tap((contextId) => {
                  console.log(`[${contextId}] after welcome user`);
                })
              ),
          },
        ],
      },
    },
  ];

  private ruleStore: IRuleStore;
  constructor(
    private toastr: ToastrService,
  ) {
    // create a store that knows about your rules
    this.ruleStore = new SimpleRuleStore(...this.rules);
  }

  getRuleStore(): IRuleStore {
    return this.ruleStore;
  }
}
