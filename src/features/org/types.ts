export enum OrgRole {
    PENDING = 0,
    MEMBER = 10,
    MANAGER = 50,
    ADMIN = 100
}

type BaseOrgData = {
    level: OrgRole;
    joinedAt?: any;
    requestedAt?: any;
};

export type OrgMembership = BaseOrgData & {
    id: string;
    name: string;
    isAutoJoin?: boolean;
    isActive?: boolean;
};

export type OrgMember = BaseOrgData & {
    id?: string;
    uid: string;
    email: string | null;
    name?: string;
    userName?: string;
    updatedAt?: any;
    isActive?: boolean;
};