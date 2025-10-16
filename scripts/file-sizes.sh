# Compact version with aligned columns
printf "%-40s %10s %10s %10s %10s %s\n" "File" "Original" "KB" "Gzipped" "KB" "Path"
printf "%-40s %10s %10s %10s %10s %s\n" "----" "--------" "--" "-------" "--" "----"
for file in dist/*.min.js dist/**/*.min.js; do
    if [ -f "$file" ]; then
        original=$(wc -c < "$file")
        compressed=$(gzip -c "$file" | wc -c)
        original_kb=$(echo "scale=2; $original / 1024" | bc)
        compressed_kb=$(echo "scale=2; $compressed / 1024" | bc)
        filename=$(basename "$file")
        relative_path=$(dirname "${file#dist/}")
        [ "$relative_path" = "." ] && relative_path=""
        printf "%-40s %10d %10s %10d %10s %s\n" "$filename" "$original" "${original_kb}KB" "$compressed" "${compressed_kb}KB" "$relative_path"
    fi
done
