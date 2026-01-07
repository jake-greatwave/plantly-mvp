"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompanyVideoProps {
  videoUrl: string;
}

function getYouTubeEmbedUrl(url: string): string | null {
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(youtubeRegex);
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return null;
}

function getVimeoEmbedUrl(url: string): string | null {
  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
  const match = url.match(vimeoRegex);
  if (match) {
    return `https://player.vimeo.com/video/${match[1]}`;
  }
  return null;
}

export function CompanyVideo({ videoUrl }: CompanyVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const youtubeEmbed = getYouTubeEmbedUrl(videoUrl);
  const vimeoEmbed = getVimeoEmbedUrl(videoUrl);
  const embedUrl = youtubeEmbed || vimeoEmbed || videoUrl;

  if (!isPlaying) {
    return (
      <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden group cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            onClick={() => setIsPlaying(true)}
            size="lg"
            className="bg-white/90 hover:bg-white text-gray-900 rounded-full w-20 h-20 shadow-xl"
          >
            <Play className="w-10 h-10 ml-1" fill="currentColor" />
          </Button>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white text-sm font-medium">회사 소개 영상</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
      <iframe
        src={embedUrl}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="회사 소개 영상"
      />
    </div>
  );
}









