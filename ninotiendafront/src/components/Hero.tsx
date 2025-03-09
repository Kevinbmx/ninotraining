import React from 'react'
import { Link, Button } from "@nextui-org/react";

const hero = () => {
    return (
        <div className="custom-screen py-28 text-gray-600">
            <div className="space-y-5 max-w-4xl mx-auto text-center">
                <h1 className="text-4xl text-gray-800 font-extrabold mx-auto sm:text-6xl">
                    Domina el Bmx Racing a tu manera
                </h1>
                <p className="max-w-xl mx-auto">
                    Entrena con nosotros y seras el mejor.
                </p>
                <div className="flex items-center justify-center gap-x-3 font-medium text-sm">
                    <Button
                        href="#"
                        as={Link}
                        color="primary"
                        className="text-white bg-gray-800 hover:bg-gray-600 active:bg-gray-900 "
                        variant="solid"
                    >
                        Comienza ya
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default hero
