const countriesContainer = document.getElementById("countries-container");
const searchInput = document.getElementById("searchInput");

const fetchCountries = async (signal) => {
	const response = await fetch("https://restcountries.com/v3.1/all", {
		signal: signal,
	});
	const result = await response.json();
	return result;
};
const getCountryHtml = (countryInfo) => {
	return `
        <article class="country-container">
        <img
            class="country-flag"
            src="${countryInfo.flags.png}"
            alt="Country"
        />
        <div class="country-info-container">
            <header>${countryInfo.name.common}</header>
            <div class="other-country-info">
                <div class="country-info">
                    <p class="country-info-name">
                        population:<span class="country-info-value"> ${
													countryInfo.population
												}</span>
                    </p>
                </div>
                <div class="country-info">
                    <p class="country-info-name">
                        Region:<span class="country-info-value"> ${
													countryInfo.region
												}</span>
                    </p>
                </div>
                <div class="country-info">
                    <p class="country-info-name">
                        Capital:<span class="country-info-value"> ${
													countryInfo?.capital !== undefined
														? countryInfo?.capital[0]
														: "Unknown"
												}</span>
                    </p>
                </div>
            </div>
                </div>
            </article>
`;
};
const getFilteredCountriesByName = async (name, signal) => {
	const response = await fetch(`https://restcountries.com/v3.1/name/${name}`, {
		signal: signal,
	});
	if (response.status === 200) {
		const data = await response.json();
		return data;
	} else {
		return [];
	}
};
const showCountries = async (countries) => {
	const filteredCountries = countries.filter(
		(item) => item.name.common !== "Israel"
	);
	const countriesHtml = filteredCountries.reduce(
		(fullHtml, item) => fullHtml + getCountryHtml(item),
		""
	);
	countriesContainer.innerHTML = countriesHtml;
};
const showAllCountries = async (signal) => {
	const countries = await fetchCountries(signal);
	showCountries(countries);
};
showAllCountries();

searchInput.addEventListener("input", async (e) => {
	const controller = new AbortController();
	const { signal } = controller;
	console.log("input value:", e.target.value);
	if (e.target.value === "") {
		await showAllCountries(signal);
	} else {
		const countries = await getFilteredCountriesByName(e.target.value, signal);
		console.log("Countries:", countries);
		if (countries.length === 0) {
			countriesContainer.innerHTML = "No Countries Found With That Name";
		} else {
			showCountries(countries);
		}
	}
});
