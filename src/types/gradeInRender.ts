export interface GradeInRenderAttributes {
    render: any;
    grade: any;
  }

  export interface GradeInRender {
    id: number;
    attributes: GradeInRenderAttributes;
  }

  export interface GradeInRenderState {
    gradesInRender: GradeInRender | null;
    loading: boolean;
    error: string | null;
  }
