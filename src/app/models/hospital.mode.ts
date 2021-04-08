interface _HospitalUser{
    _id: string;
    nombre: string;
    img: string;
}


export class Hospital {
    constructor(
        public nombre: string,
        public id?: string,
        public user?: _HospitalUser,
        public img?: string
    ){}
}