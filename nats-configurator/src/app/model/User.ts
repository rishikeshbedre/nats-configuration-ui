export class Permission {
    public publish: Array<string>;
    public subscribe: Array<string>;
}

export class User {
    public name: string;
    public permissions: Permission;
}
