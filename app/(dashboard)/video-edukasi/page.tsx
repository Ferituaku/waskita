import React from 'react';
import Header from "@/components/Header";

const VideoEdukasiPage: React.FC = () => {
    return (
        <>
            <Header title="Video Edukasi" />
            <div className="p-8">
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Halaman Video Edukasi</h1>
                    <p className="mt-4 text-gray-600">
                        Konten untuk halaman ini akan segera tersedia.
                    </p>
                </div>
            </div>
        </>
    );
};

export default VideoEdukasiPage;
