/**
 * Services Index
 * Central export point for all API services
 */

export { default as api, checkApiHealth } from './api';
export type { ApiResponse } from './api';

export { GroupService } from './groupService';
export type { Group, CreateGroupData, GroupMember, JoinGroupData } from './groupService';

export { UserService } from './userService';
export type { User, AuthData, UserProfile, AuthResponse } from './userService';