// rolesManager.js

class RolesManager {
    constructor() {
        this.roleHierarchy = ["employee", "manager", "admin", "owner"];
        this.permissions = {
            acceptRequest: ["admin", "owner"],
            assignRole: ["admin", "owner"]
        };
    }

    // Checks if a user has at least one role that allows performing a certain action
    hasPermission(userRoles, action) {
        const allowedRoles = this.permissions[action];
        if (!allowedRoles) {
            throw new Error(`Action "${action}" is not defined in permissions.`);
        }
        return userRoles.some(role => allowedRoles.includes(role));
    }

    // Checks if a user can assign a specific role to another user
    canAssignRole(userRoles, roleToAssign) {
        const maxUserRoleIndex = this.getMaxRoleIndex(userRoles);
        const roleToAssignIndex = this.roleHierarchy.indexOf(roleToAssign);

        if (roleToAssignIndex === -1) {
            throw new Error("Invalid role provided.");
        }

        // The user can only assign roles that are equal to or lower than their highest role
        return maxUserRoleIndex >= roleToAssignIndex;
    }

    // Returns the index of the highest role the user has
    getMaxRoleIndex(userRoles) {
        return Math.max(...userRoles.map(role => this.roleHierarchy.indexOf(role)));
    }

    // Example: Check if a user can accept a request
    canAcceptRequest(userRoles) {
        return this.hasPermission(userRoles, "acceptRequest");
    }

    // Example: Check if a user can assign a specific role to another user
    canAssignRoleToUser(userRoles, roleToAssign) {
        return this.canAssignRole(userRoles, roleToAssign);
    }
}

module.exports = RolesManager;
