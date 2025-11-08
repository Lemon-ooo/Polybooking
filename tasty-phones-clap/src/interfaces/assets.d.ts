declare module "../../../../assets/assets" {
  export const assets: Record<string, string>;
  export const facilityIcons: Record<string, string>;
  export const roomCommonData: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  export const roomsDummyData: Array<any>;
}
