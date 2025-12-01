interface GroupInterface {
  id: number;
  uuid?: string;
  name: string;
  description?: string;
  isDeleted?: boolean;
  isNew?: boolean;
}

export default GroupInterface;