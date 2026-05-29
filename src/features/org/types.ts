export type Org = {
  id: string;
  name: string;
};

export type OrgMembership = {
  id: string;
  name: string;
  level: number;
  joinedAt?: any;
  requestedAt?: any;
};

export type OrgMember = {
  id: string;
  uid: string;
  email: string | null;
  name: string;
  level: number;
  joinedAt?: any;
  requestedAt?: any;
  isActive?: boolean;
};