export function getHorizontalScrollbarHeight(): number {
    const height = 100;
    const container = document.createElement("div");
    container.style.width = "100px";
    container.style.height = `${height}px`;
    container.style.overflowX = "auto";
    const content = document.createElement("div");
    content.style.width = "200px";
    content.style.height = "100%";
    container.appendChild(content);
    document.body.appendChild(container);
    const innerHeight = Math.min(
        parseInt(getComputedStyle(container).height, 10),
        parseInt(getComputedStyle(content).height, 10)
    );
    container.remove();
    return height - innerHeight;
}
