import { Prisma } from "@prisma/client";

export interface CreateAndDeleteBlocosResponse {
    id: string;
    title: string;
    description: string;
    city: string;
    uf: string;
    createdAt: Date;
    updatedAt: Date | null;
    FotosBloco: FotosProps[]
}

export interface FindBlocosResponse {
    id: string;
    title: string;
    description: string;
    city: string;
    uf: string;
    createdAt: Date;
    updatedAt: Date | null;
    FotosBloco: FotosProps[]
}

interface FotosProps {
    image: string;
    url: string | null;
    id: string;
}

export type FotoType =  Omit<FotosProps, 'id'>

export interface BlocosInterface {
    create(bloco: Prisma.BlocosUncheckedCreateInput, foto: FotoType): Promise<CreateAndDeleteBlocosResponse>
    remove(blocoId: string): Promise<CreateAndDeleteBlocosResponse>
    findMany(page: number): Promise<FindBlocosResponse[]>
}