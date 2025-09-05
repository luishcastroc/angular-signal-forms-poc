import { Routes } from '@angular/router';

import { AsyncValidationComponent } from './async-validation.component';
import { BasicFormComponent } from './basic-form.component';
import { ConditionalLogicComponent } from './conditional-logic.component';
import { FormArraysComponent } from './form-arrays.component';
import { NestedFormsComponent } from './nested-forms.component';
import { SchemaValidationComponent } from './schema-validation.component';
import { ValidatorsExampleComponent } from './validators-example.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/basic-form',
    pathMatch: 'full',
  },
  {
    path: 'basic-form',
    component: BasicFormComponent,
  },
  {
    path: 'schema-validation',
    component: SchemaValidationComponent,
  },
  {
    path: 'validators-example',
    component: ValidatorsExampleComponent,
  },
  {
    path: 'async-validation',
    component: AsyncValidationComponent,
  },
  {
    path: 'conditional-logic',
    component: ConditionalLogicComponent,
  },
  {
    path: 'nested-forms',
    component: NestedFormsComponent,
  },
  {
    path: 'form-arrays',
    component: FormArraysComponent,
  },
];
