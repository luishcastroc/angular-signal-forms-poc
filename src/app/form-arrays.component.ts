import { JsonPipe } from '@angular/common';
import {
  Component,
  signal,
} from '@angular/core';
import {
  Control,
  form,
  required,
} from '@angular/forms/signals';

import { getDefaultErrorMessage } from './validators';

@Component({
  selector: 'app-form-arrays',
  imports: [Control, JsonPipe],
  template: `
    <div class="container">
      <h1>Dynamic Form Arrays Example</h1>
      <p class="description">
        Team project form demonstrating dynamic field management with
        array-based data structures.
      </p>

      <div class="info-box">
        <h3>🎯 Dynamic Forms Features</h3>
        <p>
          <strong>Add/Remove:</strong> Dynamically add or remove team members
          and skills
        </p>
        <p>
          <strong>Validation:</strong> Each array item has its own validation
          rules
        </p>
        <p>
          <strong>Cross-validation:</strong> Team must have at least 2 members
          with different roles
        </p>
      </div>

      <form class="form">
        <div class="form-group">
          <label for="projectName">Project Name *</label>
          <input
            id="projectName"
            [control]="projectForm.projectName"
            class="form-control"
            placeholder="Enter project name"
          />
          @for (error of projectForm.projectName().errors(); track error.kind) {
          <div class="error-message">
            {{
              error.message ||
                getDefaultErrorMessage(error.kind, 'Project Name')
            }}
          </div>
          }
        </div>

        <div class="form-group">
          <label for="description">Description *</label>
          <textarea
            id="description"
            [control]="projectForm.description"
            class="form-control textarea"
            placeholder="Describe your project"
            rows="3"
          ></textarea>
          @for (error of projectForm.description().errors(); track error.kind) {
          <div class="error-message">
            {{
              error.message || getDefaultErrorMessage(error.kind, 'Description')
            }}
          </div>
          }
        </div>

        <!-- Team Members Array -->
        <div class="array-section">
          <div class="array-header">
            <h3>Team Members ({{ projectData().teamMembers.length }})</h3>
            <button type="button" class="add-button" (click)="addTeamMember()">
              + Add Member
            </button>
          </div>

          @for (member of projectData().teamMembers; track $index; let i =
          $index) {
          <div class="array-item">
            <div class="array-item-header">
              <h4>Member {{ i + 1 }}</h4>
              <button
                type="button"
                class="remove-button"
                (click)="removeTeamMember(i)"
                [disabled]="projectData().teamMembers.length <= 1"
              >
                ✕ Remove
              </button>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label [for]="'member-name-' + i">Name *</label>
                <input
                  [id]="'member-name-' + i"
                  [value]="member.name"
                  (input)="updateTeamMemberName(i, $event)"
                  class="form-control"
                  placeholder="Member name"
                />
                @for (error of getTeamMemberErrors(i, 'name'); track error.kind)
                {
                <div class="error-message">{{ error.message }}</div>
                }
              </div>

              <div class="form-group">
                <label [for]="'member-role-' + i">Role *</label>
                <select
                  [id]="'member-role-' + i"
                  [value]="member.role"
                  (change)="updateTeamMemberRole(i, $event)"
                  class="form-control"
                >
                  <option value="">Select role</option>
                  <option value="frontend">Frontend Developer</option>
                  <option value="backend">Backend Developer</option>
                  <option value="fullstack">Full-Stack Developer</option>
                  <option value="designer">UI/UX Designer</option>
                  <option value="pm">Project Manager</option>
                  <option value="qa">QA Engineer</option>
                </select>
                @for (error of getTeamMemberErrors(i, 'role'); track error.kind)
                {
                <div class="error-message">{{ error.message }}</div>
                }
              </div>
            </div>

            <div class="form-group">
              <label [for]="'member-email-' + i">Email *</label>
              <input
                [id]="'member-email-' + i"
                type="email"
                [value]="member.email"
                (input)="updateTeamMemberEmail(i, $event)"
                class="form-control"
                placeholder="member@example.com"
              />
              @for (error of getTeamMemberErrors(i, 'email'); track error.kind)
              {
              <div class="error-message">{{ error.message }}</div>
              }
            </div>
          </div>
          } @for (error of getTeamValidationErrors(); track error.kind) {
          <div class="error-message team-error">{{ error.message }}</div>
          }
        </div>

        <!-- Skills Array -->
        <div class="array-section">
          <div class="array-header">
            <h3>Required Skills ({{ projectData().requiredSkills.length }})</h3>
            <button type="button" class="add-button" (click)="addSkill()">
              + Add Skill
            </button>
          </div>

          @for (skill of projectData().requiredSkills; track $index; let i =
          $index) {
          <div class="skill-item">
            <div class="form-row">
              <div class="form-group flex-grow">
                <label [for]="'skill-' + i">Skill {{ i + 1 }}</label>
                <input
                  [id]="'skill-' + i"
                  [value]="skill"
                  (input)="updateSkill(i, $event)"
                  class="form-control"
                  placeholder="Enter required skill"
                />
                @for (error of getSkillErrors(i); track error.kind) {
                <div class="error-message">{{ error.message }}</div>
                }
              </div>
              <button
                type="button"
                class="remove-button"
                (click)="removeSkill(i)"
                title="Remove skill"
              >
                ✕
              </button>
            </div>
          </div>
          } @if (projectData().requiredSkills.length === 0) {
          <div class="empty-state">
            <p>No skills added yet. Click "Add Skill" to get started.</p>
          </div>
          }
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="submit-button"
            [disabled]="projectForm().invalid()"
            [class.disabled]="projectForm().invalid()"
          >
            Create Project
          </button>

          <button type="button" class="reset-button" (click)="resetForm()">
            Reset
          </button>
        </div>

        <div class="debug-info">
          <h3>Form State & Array Validation</h3>
          <div class="debug-content">
            <p><strong>Form Valid:</strong> {{ projectForm().valid() }}</p>
            <p>
              <strong>Team Members:</strong>
              {{ projectData().teamMembers.length }}
            </p>
            <p>
              <strong>Required Skills:</strong>
              {{ projectData().requiredSkills.length }}
            </p>
            <p><strong>Unique Roles:</strong> {{ getUniqueRoles().length }}</p>
            <hr />
            <p><strong>Current Data:</strong></p>
            <pre>{{ projectData() | json }}</pre>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      /* Component-specific styles only - shared styles are in global styles */

      /* Ensure array items don't overflow */
      .array-item {
        overflow: hidden;
        box-sizing: border-box;
      }

      /* Team member form layout - 2 fields per row, then email on separate line */
      .array-item .form-row {
        gap: 1rem;
      }

      /* Make sure form controls don't overflow */
      .array-item .form-control {
        min-width: 0; /* Allow flexbox shrinking */
        box-sizing: border-box;
      }

      /* Skills section styling */
      .skill-item .form-group {
        margin-bottom: 0;
      }

      .skill-item .form-row {
        align-items: flex-end;
        gap: 1rem;
      }

      /* Align remove button with input field */
      .skill-item .remove-button {
        padding: 0.75rem;
        font-size: 0.85rem;
        min-width: 2.5rem;
        height: 3rem; /* Match input height */
        align-self: flex-end;
        margin-bottom: 0;
        flex-shrink: 0; /* Don't shrink the button */
      }

      /* Override for when there are errors to align with error messages */
      .skill-item .form-group:has(.error-message) + .remove-button {
        margin-bottom: 1.5rem;
      }

      /* Responsive adjustments */
      @media (max-width: 900px) {
        .array-item .form-row {
          flex-direction: column;
          gap: 1.5rem;
        }
      }
    `,
  ],
})
export class FormArraysComponent {
  // Make the helper function available in the template
  getDefaultErrorMessage = getDefaultErrorMessage;

  projectData = signal({
    projectName: '',
    description: '',
    teamMembers: [{ name: '', role: '', email: '' }],
    requiredSkills: [''],
  });

  projectForm = form(this.projectData, (project) => {
    required(project.projectName);
    required(project.description);
  });

  addTeamMember() {
    this.projectData.update((currentData) => ({
      ...currentData,
      teamMembers: [
        ...currentData.teamMembers,
        { name: '', role: '', email: '' },
      ],
    }));
  }

  removeTeamMember(index: number) {
    this.projectData.update((currentData) => {
      const newTeamMembers = currentData.teamMembers.filter(
        (_, i) => i !== index
      );
      return {
        ...currentData,
        teamMembers:
          newTeamMembers.length > 0
            ? newTeamMembers
            : [{ name: '', role: '', email: '' }],
      };
    });
  }

  updateTeamMemberName(index: number, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.projectData.update((currentData) => ({
      ...currentData,
      teamMembers: currentData.teamMembers.map((member, i) =>
        i === index ? { ...member, name: value } : member
      ),
    }));
  }

  updateTeamMemberRole(index: number, event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.projectData.update((currentData) => ({
      ...currentData,
      teamMembers: currentData.teamMembers.map((member, i) =>
        i === index ? { ...member, role: value } : member
      ),
    }));
  }

  updateTeamMemberEmail(index: number, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.projectData.update((currentData) => ({
      ...currentData,
      teamMembers: currentData.teamMembers.map((member, i) =>
        i === index ? { ...member, email: value } : member
      ),
    }));
  }

  addSkill() {
    this.projectData.update((currentData) => ({
      ...currentData,
      requiredSkills: [...currentData.requiredSkills, ''],
    }));
  }

  removeSkill(index: number) {
    this.projectData.update((currentData) => ({
      ...currentData,
      requiredSkills: currentData.requiredSkills.filter((_, i) => i !== index),
    }));
  }

  updateSkill(index: number, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.projectData.update((currentData) => ({
      ...currentData,
      requiredSkills: currentData.requiredSkills.map((skill, i) =>
        i === index ? value : skill
      ),
    }));
  }

  getTeamMemberErrors(index: number, field: string) {
    const member = this.projectData().teamMembers[index];
    const errors = [];

    if (field === 'name' && !member?.name) {
      errors.push({ kind: 'required', message: 'Name is required' });
    }

    if (field === 'role' && !member?.role) {
      errors.push({ kind: 'required', message: 'Role is required' });
    }

    if (field === 'email') {
      if (!member?.email) {
        errors.push({ kind: 'required', message: 'Email is required' });
      } else if (!/\S+@\S+\.\S+/.test(member.email)) {
        errors.push({
          kind: 'email',
          message: 'Please enter a valid email address',
        });
      }
    }

    return errors;
  }

  getSkillErrors(index: number) {
    const skill = this.projectData().requiredSkills[index];
    const errors = [];

    if (!skill || skill.trim() === '') {
      errors.push({ kind: 'required', message: 'Skill is required' });
    } else if (skill.length < 2) {
      errors.push({
        kind: 'minlength',
        message: 'Skill must be at least 2 characters',
      });
    }

    return errors;
  }

  getTeamValidationErrors() {
    const errors = [];
    const teamMembers = this.projectData().teamMembers;

    // Check if team has at least 2 members
    const validMembers = teamMembers.filter((m) => m.name && m.role && m.email);
    if (validMembers.length < 2) {
      errors.push({
        kind: 'teamSize',
        message: 'Team must have at least 2 members with complete information',
      });
    }

    // Check for duplicate roles in key positions
    const roles = validMembers.map((m) => m.role);
    const uniqueRoles = new Set(roles);
    if (roles.includes('pm') && roles.filter((r) => r === 'pm').length > 1) {
      errors.push({
        kind: 'duplicateRole',
        message: 'Only one Project Manager is allowed per team',
      });
    }

    return errors;
  }

  getUniqueRoles() {
    const roles = this.projectData()
      .teamMembers.filter((m) => m.role)
      .map((m) => m.role);
    return [...new Set(roles)];
  }

  resetForm() {
    this.projectData.set({
      projectName: '',
      description: '',
      teamMembers: [{ name: '', role: '', email: '' }],
      requiredSkills: [''],
    });
  }
}
