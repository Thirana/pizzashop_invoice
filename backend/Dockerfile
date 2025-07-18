FROM golang:alpine3.22

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main ./cmd/api
RUN chmod +x main

EXPOSE 8080

CMD ["./main"]