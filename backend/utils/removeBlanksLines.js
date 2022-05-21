function removeBlanksLines(text) {
    const allLines = text.split("\n");
    const withoutBlankLinesandMarks = allLines.map((line) => {
        return line.trim()
    });

    return withoutBlankLinesandMarks.join(" ")
}
module.exports={
    removeBlanksLines
}