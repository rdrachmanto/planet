import { parse } from "smol-toml"

async function loadConfig() {
    const res = await fetch("../config.toml");
    if (!res.ok) throw new Error("Failed to load config.toml");
    return parse(await res.text());
}

function renderFromTemplate({ containerId, templateId, items, fill }) {
    const container = document.getElementById(containerId)
    const template = document.getElementById(templateId)
    for (const [identifier, item] of Object.entries(items)) {
        const node = template.content.cloneNode(true)
        fill(node, item)
        container.appendChild(node)
    }
}

const config = await loadConfig()
const apps = config.apps
const services = config.services

renderFromTemplate({
    containerId: "app-listing",
    templateId: "apps-card",
    items: apps,
    fill: (node, item) => {
        const a = node.querySelector("[data-url]")
        a.textContent = item.title
        a.href = item.url

        node.querySelector("[data-subtitle]").textContent = item.subtitle
    }
})

renderFromTemplate({
    containerId: "service-listing",
    templateId: "services-card",
    items: services,
    fill: (node, item) => {
        node.querySelector("[data-title]").textContent = item.title
        node.querySelector("[data-subtitle]").textContent = item.subtitle
    }
})
