import { useEffect, useState } from "react";
import * as provinceService from "../services/provinceService";

function ShippingAddressFields({ value, onChange, errors = {} }) {
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [provincesLoading, setProvincesLoading] = useState(true);
  const [loadedProvinceCode, setLoadedProvinceCode] = useState("");

  useEffect(() => {
    let cancelled = false;

    provinceService
      .fetchProvinces()
      .then((response) => {
        if (!cancelled) {
          setProvinces(response.data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProvinces([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setProvincesLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!value.provinceCode) {
      return undefined;
    }

    let cancelled = false;

    provinceService
      .fetchProvinceWithWards(value.provinceCode)
      .then((response) => {
        if (!cancelled) {
          setWards(response.data.wards || []);
          setLoadedProvinceCode(value.provinceCode);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setWards([]);
          setLoadedProvinceCode(value.provinceCode);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [value.provinceCode]);

  const wardsLoading =
    Boolean(value.provinceCode) && loadedProvinceCode !== value.provinceCode;
  const visibleWards =
    value.provinceCode && loadedProvinceCode === value.provinceCode ? wards : [];

  const handleProvinceChange = (event) => {
    const code = event.target.value;

    if (!code) {
      onChange({
        provinceCode: "",
        provinceName: "",
        wardCode: "",
        wardName: "",
        streetAddress: value.streetAddress,
      });
      return;
    }

    const province = provinces.find((item) => String(item.code) === code);

    onChange({
      provinceCode: String(province.code),
      provinceName: province.name,
      wardCode: "",
      wardName: "",
      streetAddress: value.streetAddress,
    });
  };

  const handleWardChange = (event) => {
    const code = event.target.value;

    if (!code) {
      onChange({
        ...value,
        wardCode: "",
        wardName: "",
      });
      return;
    }

    const ward = visibleWards.find((item) => String(item.code) === code);

    onChange({
      ...value,
      wardCode: String(ward.code),
      wardName: ward.name,
    });
  };

  const handleStreetChange = (event) => {
    onChange({
      ...value,
      streetAddress: event.target.value,
    });
  };

  const selectClass =
    "input-field !rounded-xl bg-gundam-surface text-white appearance-none cursor-pointer";

  return (
    <>
      <div className="sm:col-span-2">
        <label className="text-sm text-gundam-muted mb-1.5 block">Province *</label>
        <select
          value={value.provinceCode}
          onChange={handleProvinceChange}
          disabled={provincesLoading}
          className={selectClass}
        >
          <option value="">
            {provincesLoading ? "Loading provinces..." : "Select province"}
          </option>
          {provinces.map((province) => (
            <option key={province.code} value={String(province.code)}>
              {province.name}
            </option>
          ))}
        </select>
        {errors.provinceCode && (
          <p className="text-red-400 text-xs mt-1">{errors.provinceCode}</p>
        )}
      </div>

      <div className="sm:col-span-2">
        <label className="text-sm text-gundam-muted mb-1.5 block">Ward *</label>
        <select
          value={value.wardCode}
          onChange={handleWardChange}
          disabled={!value.provinceCode || wardsLoading}
          className={selectClass}
        >
          <option value="">
            {!value.provinceCode
              ? "Select province first"
              : wardsLoading
                ? "Loading wards..."
                : "Select ward"}
          </option>
          {visibleWards.map((ward) => (
            <option key={ward.code} value={String(ward.code)}>
              {ward.name}
            </option>
          ))}
        </select>
        {errors.wardCode && (
          <p className="text-red-400 text-xs mt-1">{errors.wardCode}</p>
        )}
      </div>

      <div className="sm:col-span-2">
        <label className="text-sm text-gundam-muted mb-1.5 block">Street Address *</label>
        <input
          name="streetAddress"
          value={value.streetAddress}
          onChange={handleStreetChange}
          className="input-field !rounded-xl"
          placeholder="House number, street name"
        />
        {errors.streetAddress && (
          <p className="text-red-400 text-xs mt-1">{errors.streetAddress}</p>
        )}
      </div>
    </>
  );
}

export default ShippingAddressFields;
