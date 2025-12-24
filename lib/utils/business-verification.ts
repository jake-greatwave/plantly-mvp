export interface BusinessVerificationResult {
  isValid: boolean;
  message: string;
  data?: {
    b_no: string;
    b_stt: string;
    b_stt_cd: string;
    tax_type: string;
    tax_type_cd: string;
    end_dt: string;
    utcc_yn: string;
  };
}

export interface BusinessVerificationOptions {
  start_dt?: string;
  p_nm?: string;
  p_nm2?: string;
  b_nm?: string;
  corp_no?: string;
  b_sector?: string;
  b_type?: string;
  b_adr?: string;
}

export async function verifyBusinessNumber(
  businessNumber: string,
  options?: BusinessVerificationOptions
): Promise<BusinessVerificationResult> {
  const cleanedNumber = businessNumber.replace(/-/g, "");

  if (cleanedNumber.length !== 10 || !/^\d{10}$/.test(cleanedNumber)) {
    return {
      isValid: false,
      message: "사업자등록번호는 10자리 숫자여야 합니다.",
    };
  }

  const serviceKey = process.env.BUSINESS_KEY;

  if (!serviceKey) {
    return {
      isValid: false,
      message: "사업자등록번호 검증 서비스 키가 설정되지 않았습니다.",
    };
  }

  try {
    if (options?.start_dt && options?.p_nm) {
      return await verifyBusinessWithDetails(
        cleanedNumber,
        serviceKey,
        options
      );
    } else {
      return await verifyBusinessStatus(cleanedNumber, serviceKey);
    }
  } catch (error) {
    console.error("Business verification error:", error);
    return {
      isValid: false,
      message: "사업자등록번호 검증 중 오류가 발생했습니다.",
    };
  }
}

async function verifyBusinessStatus(
  businessNumber: string,
  serviceKey: string
): Promise<BusinessVerificationResult> {
  const url = `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${encodeURIComponent(
    serviceKey
  )}&returnType=JSON`;

  const requestBody = {
    b_no: [businessNumber],
  };

  console.log("Business status API request:", {
    url: url.replace(serviceKey, "***"),
    body: requestBody,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const responseText = await response.text();
  console.log("Business status API response status:", response.status);
  console.log("Business status API response text:", responseText);

  if (!response.ok) {
    try {
      const errorData = JSON.parse(responseText);
      console.error("Business status API error response:", errorData);
      return {
        isValid: false,
        message: errorData.message || "사업자등록번호 검증에 실패했습니다.",
      };
    } catch {
      return {
        isValid: false,
        message: `API 호출 실패 (${response.status}): ${responseText}`,
      };
    }
  }

  let data;
  try {
    data = JSON.parse(responseText);
    console.log(
      "Business status API parsed data:",
      JSON.stringify(data, null, 2)
    );
  } catch (error) {
    console.error("Business status API JSON parse error:", error, responseText);
    return {
      isValid: false,
      message: "API 응답을 파싱할 수 없습니다.",
    };
  }

  if (data.status_code && data.status_code !== "OK") {
    console.error("Business status API error:", data.status_code, data);
    return {
      isValid: false,
      message: getErrorMessage(data.status_code),
    };
  }

  console.log(
    "Business status API success:",
    data.status_code || "no status_code",
    {
      request_cnt: data.request_cnt,
      match_cnt: data.match_cnt,
      hasData: !!data.data,
    }
  );

  if (!data.data) {
    console.error("Business status API: No data property", data);
    return {
      isValid: false,
      message: "국세청에 등록되지 않은 사업자등록번호입니다.",
    };
  }

  const dataArray = Array.isArray(data.data) ? data.data : [data.data];

  if (dataArray.length === 0) {
    console.error("Business status API: Empty data array", data);
    return {
      isValid: false,
      message: "국세청에 등록되지 않은 사업자등록번호입니다.",
    };
  }

  const businessData = dataArray[0];

  if (!businessData) {
    console.error("Business status API: Invalid data structure", data);
    return {
      isValid: false,
      message: "사업자등록번호 정보를 확인할 수 없습니다.",
    };
  }

  console.log("Business data:", businessData);
  console.log("Business status code:", businessData.b_stt_cd);
  console.log("Business status:", businessData.b_stt);
  console.log("Tax type:", businessData.tax_type);

  if (!businessData.b_stt_cd || businessData.b_stt_cd === "") {
    const errorMessage =
      businessData.tax_type || "국세청에 등록되지 않은 사업자등록번호입니다.";
    console.log(
      "Business number is invalid: empty b_stt_cd, error message:",
      errorMessage
    );
    return {
      isValid: false,
      message: errorMessage,
      data: businessData,
    };
  }

  if (
    businessData.tax_type &&
    businessData.tax_type.includes("등록되지 않은")
  ) {
    console.log("Business number is invalid: tax_type contains error message");
    return {
      isValid: false,
      message: businessData.tax_type,
      data: businessData,
    };
  }

  if (businessData.b_stt_cd === "01") {
    console.log("Business number is valid (b_stt_cd: 01)");
    return {
      isValid: true,
      message: "유효한 사업자등록번호입니다.",
      data: businessData,
    };
  }

  if (!businessData.b_stt || businessData.b_stt === "") {
    console.log("Business number is invalid: empty b_stt");
    return {
      isValid: false,
      message: businessData.tax_type || "사업자등록 상태를 확인할 수 없습니다.",
      data: businessData,
    };
  }

  console.log(
    "Business number status is not valid:",
    businessData.b_stt_cd,
    businessData.b_stt
  );
  return {
    isValid: false,
    message: businessData.b_stt || "사업자등록 상태가 유효하지 않습니다.",
    data: businessData,
  };
}

async function verifyBusinessWithDetails(
  businessNumber: string,
  serviceKey: string,
  options: BusinessVerificationOptions
): Promise<BusinessVerificationResult> {
  const url = `https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=${encodeURIComponent(
    serviceKey
  )}&returnType=JSON`;

  const requestBody: any = {
    b_no: businessNumber,
    start_dt: options.start_dt!.replace(/-/g, ""),
    p_nm: options.p_nm,
  };

  if (options.p_nm2) requestBody.p_nm2 = options.p_nm2;
  if (options.b_nm) requestBody.b_nm = options.b_nm;
  if (options.corp_no) requestBody.corp_no = options.corp_no.replace(/-/g, "");
  if (options.b_sector) requestBody.b_sector = options.b_sector;
  if (options.b_type) requestBody.b_type = options.b_type;
  if (options.b_adr) requestBody.b_adr = options.b_adr;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    return {
      isValid: false,
      message: errorData.message || "사업자등록번호 검증에 실패했습니다.",
    };
  }

  const data = await response.json();

  if (data.status_code) {
    return {
      isValid: false,
      message: getErrorMessage(data.status_code),
    };
  }

  if (!data.data || data.data.length === 0) {
    return {
      isValid: false,
      message: "확인할 수 없습니다.",
    };
  }

  const validationData = data.data[0];

  if (validationData.valid === "01") {
    return {
      isValid: true,
      message: "유효한 사업자등록번호입니다.",
      data: validationData.status,
    };
  }

  return {
    isValid: false,
    message: validationData.valid_msg || "확인할 수 없습니다.",
  };
}

function getErrorMessage(statusCode: string): string {
  const errorMessages: Record<string, string> = {
    TOO_LARGE_REQUEST: "요청한 사업자 정보가 100개를 초과합니다.",
    BAD_JSON_REQUEST: "JSON 형식이 올바르지 않습니다.",
    REQUEST_DATA_MALFORMED: "필수 항목이 누락되었습니다.",
    INTERNAL_ERROR: "서버 내부 오류가 발생했습니다.",
    HTTP_ERROR: "HTTP 오류가 발생했습니다.",
  };

  return errorMessages[statusCode] || "사업자등록번호 검증에 실패했습니다.";
}
