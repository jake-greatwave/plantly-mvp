"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Search } from "lucide-react";

declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: {
          zonecode: string;
          address: string;
          addressEnglish: string;
          addressType: "R" | "J";
          bname: string;
          buildingName: string;
        }) => void;
        width?: string | number;
        height?: string | number;
      }) => {
        open: () => void;
        embed: (element: HTMLElement) => void;
      };
    };
  }
}

interface AddressInputProps {
  value?: {
    postcode?: string;
    address?: string;
    addressDetail?: string;
  };
  onChange: (value: {
    postcode: string;
    address: string;
    addressDetail: string;
  }) => void;
  required?: boolean;
  postcodeLabel?: string;
  addressLabel?: string;
  addressDetailLabel?: string;
}

export function AddressInput({
  value = {},
  onChange,
  required = false,
  postcodeLabel = "우편번호",
  addressLabel = "주소",
  addressDetailLabel = "상세주소",
}: AddressInputProps) {
  const [postcode, setPostcode] = useState(value.postcode || "");
  const [address, setAddress] = useState(value.address || "");
  const [addressDetail, setAddressDetail] = useState(value.addressDetail || "");
  const scriptLoaded = useRef(false);

  useEffect(() => {
    setPostcode(value.postcode || "");
    setAddress(value.address || "");
    setAddressDetail(value.addressDetail || "");
  }, [value.postcode, value.address, value.addressDetail]);

  useEffect(() => {
    if (scriptLoaded.current) return;

    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.onload = () => {
      scriptLoaded.current = true;
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleSearchAddress = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert("우편번호 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        const fullAddress =
          data.addressType === "R"
            ? data.address
            : data.addressEnglish || data.address;
        setPostcode(data.zonecode);
        setAddress(fullAddress);
        onChange({
          postcode: data.zonecode,
          address: fullAddress,
          addressDetail: addressDetail,
        });
      },
      width: "100%",
      height: "100%",
    }).open();
  };

  const handleAddressDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDetail = e.target.value;
    setAddressDetail(newDetail);
    onChange({
      postcode,
      address,
      addressDetail: newDetail,
    });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="postcode">
          {postcodeLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className="flex gap-2">
          <Input
            id="postcode"
            value={postcode}
            readOnly
            placeholder="우편번호"
            className="flex-1 bg-gray-50"
            required={required}
          />
          <Button
            type="button"
            onClick={handleSearchAddress}
            variant="outline"
            className="shrink-0"
          >
            <Search className="w-4 h-4 mr-2" />
            주소 검색
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">
          {addressLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="address"
            value={address}
            readOnly
            placeholder="주소를 검색해주세요"
            className="pl-9 bg-gray-50"
            required={required}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address_detail">
          {addressDetailLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Input
          id="address_detail"
          value={addressDetail}
          onChange={handleAddressDetailChange}
          placeholder="상세주소를 입력해주세요"
          required={required}
        />
      </div>
    </div>
  );
}

