# Compact version with aligned columns
printf "%-40s %10s %10s %10s %10s\n" "File" "Original" "KB" "Gzipped" "KB"
printf "%-40s %10s %10s %10s %10s\n" "----" "--------" "--" "-------" "--"
for file in dist/*.min.js dist/**/*.min.js; do
    if [ -f "$file" ]; then
        original=$(wc -c < "$file")
        compressed=$(gzip -c "$file" | wc -c)
        original_kb=$(echo "scale=2; $original / 1024" | bc)
        compressed_kb=$(echo "scale=2; $compressed / 1024" | bc)
        filename=$(basename "$file")
        printf "%-40s %10d %10s %10d %10s\n" "$filename" "$original" "${original_kb}KB" "$compressed" "${compressed_kb}KB"
    fi
done