'use client'
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Carousel, CarouselResponsiveOption } from 'primereact/carousel';
import { Tag } from 'primereact/tag';
import { ProductService } from '../../app/service/ProductService';
import { CircleArrowLeft, CircleArrowRight  } from 'lucide-react';

interface Product {
    id: string;
    code: string;
    name: string;
    description: string;
    image: string;
    price: number;
    category: string;
    quantity: number;
    inventoryStatus: string;
    rating: number;
}

export default function CarouselXP() {
    const [products, setProducts] = useState<Product[]>([]);
    const responsiveOptions: CarouselResponsiveOption[] = [
        {
            breakpoint: '1400px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '575px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    const getSeverity = (product: Product) => {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    useEffect(() => {
        ProductService.getProductsSmall().then((data: any[]) => setProducts(data.slice(0, 9)));
    }, []);

    const productTemplate = (product: Product) => {
        return (
            <div className="h-auto w-11/12 bg-white border-1 text-left py-5 px-5 border-8 border-white rounded-3xl m-2">
                <div className="mb-3 flex justify-end ">
                    <img src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.name} className=" w-52 h-52 border-8 border-gray-500 shadow-2 rounded-full" />
                </div>
                <div className="h-[220px]" >
                    <h4 className="mb-1">{product.name}</h4>
                    <h6 className="mt-0 mb-3">${product.price}</h6>
                    <Tag value={product.inventoryStatus} severity={getSeverity(product)}></Tag>
                </div>
            </div>
        );
    };
    
    return (
        
            <div className="card h-auto">
                <Carousel
                prevIcon={<CircleArrowLeft color='#ffff'/>} 
                nextIcon={<CircleArrowRight color='#ffff'/>} 
                value={products} 
                numScroll={1} 
                numVisible={1} 
                responsiveOptions={responsiveOptions} 
                itemTemplate={productTemplate} />
            </div>
        

        
    )
    
}


        